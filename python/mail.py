import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"  # Use your email provider's SMTP server
SMTP_PORT = 587
SENDER_EMAIL = "gdgnmims@gmail.com"
SENDER_PASSWORD = "zvyq ikbf ikmx egxv"  # Use App Password for security
RECEIVER_EMAIL = "ajogdand112@gmail.com"

# Read HTML file
with open("mail.html", "r", encoding="utf-8") as file:
    html_content = file.read()

# Create the email
msg = MIMEMultipart()
msg["From"] = SENDER_EMAIL
msg["To"] = RECEIVER_EMAIL
msg["Subject"] = "Registration Confirmed - HackX"

# Attach HTML content
msg.attach(MIMEText(html_content, "html"))

# Send email
try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()  # Secure connection
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {e}")
