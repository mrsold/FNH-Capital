import express from "express";
import path from "path";
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
  const PORT = 3000;

  app.use(express.json());

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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
