# Security Specification for FNH Capital

## 1. Data Invariants
- A Loan must have a valid status: 'Active', 'Funding', or 'Closed'.
- Closed loans are only visible to the Admin and the Investors listed in `investorEmails`.
- Loan documents are strictly private to authenticated users.
- Borrowers and Investors lists are strictly Admin-only.
- Borrower information inside a Loan document is strictly private to authenticated users (frontend hides it, but rules should ideally restrict it if possible). Since Firestore rules are document-level, we will restrict `get` on loans based on status and ownership.

## 2. The "Dirty Dozen" Payloads (Attacks)
1. **The Snooper**: Guest tries to list `closed` loans.
2. **The File Raider**: Guest tries to list documents for a loan.
3. **The Identity Thief**: Investor tries to read another investor's `closed` loan.
4. **The Ghost Write**: Investor tries to create a new loan.
5. **The Escalator**: Investor tries to update their own role to 'admin' in `/users`.
6. **The Status Jump**: Admin tries to update a loan status using an invalid string (not Active/Funding/Closed).
7. **The Poisoned ID**: Attacker tries to create a borrower with a 2MB ID string.
8. **The Debt Eraser**: Borrower tries to delete their own loan record (if they had access).
9. **The Shadow Investor**: Unauthenticated user tries to add themselves to `investorEmails`.
10. **The PII Leaker**: Guest tries to get borrower contact details from `/borrowers`.
11. **The Time Traveler**: Attacker tries to set a future `createdAt` timestamp.
12. **The Key Injector**: Attacker tries to add a `verified: true` field to a loan document that isn't in the schema.

## 3. Test Runner Concept
`firestore.rules.test.ts` will verify these scenarios.

## 4. Conflict Report
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| /users | Blocks self-role-update | N/A | Strict key check |
| /borrowers| Admin-only write | N/A | Strict ID validation |
| /investors| Admin-only write | N/A | Strict ID validation |
| /loans | Admin-only write | isValidStatus() check | Size checks on all strings |
| /loans/docs | Admin-only write | N/A | 500KB limit (logic) + size checks |
