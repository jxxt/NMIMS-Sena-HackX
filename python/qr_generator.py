import tkinter as tk
from tkinter import ttk, messagebox
import qrcode
import json
from pathlib import Path

# Directory to save QR codes
QR_CODES_DIR = Path("qr_codes")
QR_CODES_DIR.mkdir(parents=True, exist_ok=True)

class RegistrationApp:
    def __init__(self, root):
        self.root = root
        self.root.title("HackX 3.0 Registration")
        self.root.geometry("600x700")
        
        # Create main frame
        main_frame = ttk.Frame(root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Team Details
        ttk.Label(main_frame, text="Team Registration", font=('Helvetica', 16, 'bold')).grid(row=0, column=0, columnspan=2, pady=10)
        
        ttk.Label(main_frame, text="Team Name:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.team_name = ttk.Entry(main_frame, width=40)
        self.team_name.grid(row=1, column=1, sticky=tk.W, pady=5)
        
        ttk.Label(main_frame, text="College Name:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.college_name = ttk.Entry(main_frame, width=40)
        self.college_name.grid(row=2, column=1, sticky=tk.W, pady=5)
        
        # Members Section
        ttk.Label(main_frame, text="Team Members", font=('Helvetica', 12, 'bold')).grid(row=3, column=0, columnspan=2, pady=(20,10))
        
        self.members_frame = ttk.Frame(main_frame)
        self.members_frame.grid(row=4, column=0, columnspan=2, sticky=(tk.W, tk.E))
        
        self.member_entries = []
        self.add_member_entry()  # Add first member entry by default
        
        # Add/Remove member buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=5, column=0, columnspan=2, pady=10)
        
        ttk.Button(button_frame, text="Add Member", command=self.add_member_entry).grid(row=0, column=0, padx=5)
        ttk.Button(button_frame, text="Remove Member", command=self.remove_member_entry).grid(row=0, column=1, padx=5)
        
        # Generate QR button
        ttk.Button(main_frame, text="Generate QR Code", command=self.generate_qr).grid(row=6, column=0, columnspan=2, pady=20)
        
        # Status label
        self.status_label = ttk.Label(main_frame, text="")
        self.status_label.grid(row=7, column=0, columnspan=2)

    def add_member_entry(self):
        """Add a new member entry fields"""
        if len(self.member_entries) >= 4:
            messagebox.showwarning("Warning", "Maximum 4 team members allowed!")
            return
        
        member_frame = ttk.Frame(self.members_frame)
        member_frame.grid(row=len(self.member_entries), column=0, pady=5)
        
        ttk.Label(member_frame, text=f"Member {len(self.member_entries) + 1}:").grid(row=0, column=0, padx=5)
        name_entry = ttk.Entry(member_frame, width=20)
        name_entry.grid(row=0, column=1, padx=5)
        ttk.Label(member_frame, text="Email:").grid(row=0, column=2, padx=5)
        email_entry = ttk.Entry(member_frame, width=25)
        email_entry.grid(row=0, column=3, padx=5)
        
        self.member_entries.append((member_frame, name_entry, email_entry))

    def remove_member_entry(self):
        """Remove the last member entry"""
        if len(self.member_entries) > 1:  # Keep at least one member
            frame, _, _ = self.member_entries.pop()
            frame.destroy()
        else:
            messagebox.showwarning("Warning", "Team must have at least one member!")

    def generate_qr(self):
        """Generate QR code from form data"""
        # Validate inputs
        team_name = self.team_name.get().strip()
        college_name = self.college_name.get().strip()
        
        if not team_name or not college_name:
            messagebox.showerror("Error", "Team name and college name are required!")
            return
        
        # Collect member data
        members = []
        for _, name_entry, email_entry in self.member_entries:
            name = name_entry.get().strip()
            email = email_entry.get().strip()
            
            if name and email:
                members.append({
                    "name": name,
                    "email": email
                })
        
        if len(members) < 1:
            messagebox.showerror("Error", "At least one team member is required!")
            return
        
        # Generate QR code data
        qr_data = {
            "team_name": team_name,
            "college_name": college_name,
            "members": members
        }
        
        try:
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4
            )
            qr.add_data(json.dumps(qr_data))
            qr.make(fit=True)
            
            # Save QR code
            img = qr.make_image(fill_color="black", back_color="white")
            file_path = QR_CODES_DIR / f"{team_name}.png"
            img.save(str(file_path))
            
            self.status_label.config(text=f"QR Code generated successfully!\nSaved as: {file_path.name}")
            messagebox.showinfo("Success", f"QR Code generated successfully!\nSaved in {QR_CODES_DIR} folder")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to generate QR code: {str(e)}")

def main():
    root = tk.Tk()
    app = RegistrationApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()