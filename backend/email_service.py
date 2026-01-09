import smtplib
from email.message import EmailMessage
import os

def send_alert(defect_data):
    """
    Sends an email alert for critical defects.
    """
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")
    recipient_email = os.getenv("ALERT_RECIPIENT")

    if not sender_email or not sender_password:
        print("Email credentials not set. Skipping email alert.")
        return

    msg = EmailMessage()
    msg['Subject'] = f"CRITICAL: Railway Track Defect Detected at {defect_data.get('chainage', 'Unknown Location')}"
    msg['From'] = sender_email
    msg['To'] = recipient_email

    content = f"""
    CRITICAL DEFECT DETECTED
    
    Type: {defect_data['defect_type']}
    Confidence: {defect_data['confidence']}%
    Location: {defect_data.get('latitude')}, {defect_data.get('longitude')} (Near {defect_data.get('nearest_station')})
    timestamp: {defect_data.get('timestamp')}
    
    SEVERITY: {defect_data.get('severity')}
    
    IMMEDIATE ACTION:
    {defect_data.get('action_required')}
    
    RESOLUTION:
    {defect_data.get('resolution_steps')}
    
    Image URL: {defect_data.get('image_url')}
    """
    
    msg.set_content(content)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)
        print("Alert email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")
