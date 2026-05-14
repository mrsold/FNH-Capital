import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      const keys = Object.keys(process.env).filter(k => k.toLowerCase().includes("resend") || k.toLowerCase().includes("api"));
      throw new Error(`RESEND_API_KEY is missing. Found similar keys: ${keys.join(", ") || "none"}. Please ensure the secret is named exactly RESEND_API_KEY in the Settings menu.`);
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV,
      cwd: process.cwd(),
      dirname: __dirname,
      filename: __filename
    });
  });

  app.get("/api/debug", (req, res) => {
    try {
      const files = fs.readdirSync(process.cwd());
      const distExists = fs.existsSync(path.join(process.cwd(), 'dist'));
      const distFiles = distExists ? fs.readdirSync(path.join(process.cwd(), 'dist')) : [];
      
      res.json({
        cwd: process.cwd(),
        files,
        distExists,
        distFiles,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route for contact form
  app.post("/api/contact", async (req, res) => {
    const { 
      role, 
      name, 
      email, 
      type, 
      duration, 
      amount, 
      propertyValue, 
      investAmount, 
      isAccredited, 
      message 
    } = req.body;

    console.log("Received contact form submission:", req.body);

    const recipient = "mr.sold@gmail.com";

    try {
      const { data, error } = await getResend().emails.send({
        from: 'FNH Capital <onboarding@resend.dev>',
        to: recipient,
        replyTo: email, // Allow the user to reply directly to the person who filled the form
        subject: `New ${role} Inquiry: ${name}`,
        text: `
          New Inquiry Details:
          Role: ${role}
          Name: ${name}
          Email: ${email}
          ${role === 'borrower' ? `
          Loan Type: ${type}
          Duration: ${duration}
          Amount: ${amount}
          Property Value: ${propertyValue}
          ` : `
          Investment Amount: ${investAmount}
          Accredited: ${isAccredited ? 'Yes' : 'No'}
          `}
          Message: ${message}
        `,
      });

      if (error) {
        throw error;
      }

      console.log("Email sent successfully:", data);
      res.status(200).json({ success: true, message: "Inquiry received. Thank you!" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      // Extract as much detail as possible
      let errorMessage = "Failed to send inquiry.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = error.message || JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }

      res.status(500).json({ 
        success: false, 
        message: errorMessage
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
  // In production, we need the 'dist' folder which contains the built React app.
    let distPath = path.join(process.cwd(), 'dist');
    
    // Priority 1: If current folder contains 'assets' and 'index.html', we are likely INSIDE dist already.
    if (fs.existsSync(path.join(process.cwd(), 'assets')) && fs.existsSync(path.join(process.cwd(), 'index.html'))) {
      distPath = process.cwd();
    } 
    // Priority 2: Use the 'dist' subfolder if it exists.
    else if (fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
      distPath = path.join(process.cwd(), 'dist');
    }
    // Fallback: This might serve the source index.html (which is blank), so we log a warning.
    else {
      console.warn("[Warning] Production dist/index.html not found. Defaulting to CWD.");
      distPath = process.cwd();
    }

    console.log(`[Production] Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      
      // Safety check: Is this the source index.html or the built one?
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        // Source index.html has /src/main.tsx or vite - built one has /assets/index-
        if (content.includes('/src/main.tsx') || content.includes('@vite/client')) {
           console.error("[Critical] Detected SOURCE index.html instead of BUILT index.html. Your page will be blank. Ensure 'dist' folder is uploaded.");
           return res.status(500).send("Configuration Error: The server is pointing to the source directory instead of the 'dist' directory. Please ensure your cPanel Application Root and Startup File are correct.");
        }
      }

      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html from ${indexPath}:`, err);
          res.status(500).send("Server Error: Static files (index.html) not found. Checked: " + indexPath + ". Current CWD: " + process.cwd());
        }
      });
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
