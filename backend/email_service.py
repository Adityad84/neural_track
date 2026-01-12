import resend
import base64
import os

def send_alert(defect_data, recipient_email=None, station_name=None):
    """
    Sends an email alert using Resend API to bypass Render SMTP blocks.
    """
    resend.api_key = os.getenv("RESEND_API_KEY")
    
    # Use provided recipient or fall back to env variable
    if not recipient_email:
        recipient_email = os.getenv("ALERT_RECIPIENT")

    if not resend.api_key:
        print("✗ RESEND_API_KEY not set. Skipping email.")
        return
    
    if not recipient_email:
        print("✗ No recipient email provided. Skipping email.")
        return

    # 1. Prepare Image Attachment
    image_path = defect_data.get('image_url')
    physical_path = None
    attachments = []
    
    if image_path:
        if os.path.exists(image_path):
            physical_path = image_path
        elif image_path.startswith('/uploads/'):
            filename = os.path.basename(image_path)
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            physical_path = os.path.join(backend_dir, 'uploads', filename)

    if physical_path and os.path.exists(physical_path):
        try:
            with open(physical_path, "rb") as f:
                content = base64.b64encode(f.read()).decode()
                attachments.append({
                    "content": content,
                    "filename": os.path.basename(physical_path),
                })
            print(f"✓ Image prepared for Resend: {os.path.basename(physical_path)}")
        except Exception as e:
            print(f"⚠ Could not process image: {e}")

    # 2. Create HTML Content
    location_info = station_name if station_name else defect_data.get('nearest_station', 'Unknown Location')
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #dc3545;">⚠️ CRITICAL DEFECT DETECTED ⚠️</h2>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Type:</strong> {defect_data['defect_type']}</p>
                <p><strong>Confidence:</strong> {defect_data['confidence']}%</p>
                <p><strong>Location:</strong> {location_info}</p>
                <p><strong>Timestamp:</strong> {defect_data.get('timestamp')}</p>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin-top: 0;">⚡ IMMEDIATE ACTION REQUIRED</h3>
                <p>{defect_data.get('action_required')}</p>
            </div>
            <p style="text-align: center; color: #6c757d; font-size: 0.9em;">Automated alert from Railway Defect Detection System</p>
        </div>
    </body>
    </html>
    """

    # 3. Send via Resend
    try:
        params = {
            "from": "Railway Monitor <onboarding@resend.dev>",
            "to": [recipient_email],
            "subject": f"🚨 CRITICAL: Railway Defect at {location_info}",
            "html": html_content,
            "attachments": attachments
        }
        
        email = resend.Emails.send(params)
        print(f"✓ Alert email sent successfully via Resend. ID: {email['id']}")
    except Exception as e:
        print(f"✗ Resend API error: {e}")
