from django.db import models
from django.conf import settings
from django.core.mail import send_mail

class ChatMessage(models.Model):
    # Sender/Receiver can be any user (Staff or Admin)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.message[:20]}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Email Notification Logic
        if is_new:
            try:
                sender_name = getattr(self.sender, 'name', self.sender.email)
                sender_email = self.sender.email
                
                subject = f"New Message from {sender_name} ({sender_email})"
                body = f"You received a new message from {sender_name} ({sender_email}):\n\n{self.message}\n\nLog in to reply."
                
                # If sender is Staff (not superuser), email Admin (using settings.EMAIL_HOST_USER as admin email or hardcoded for now)
                # If sender is Admin, email Receiver (Staff)
                recipient_email = None
                
                # Better Admin Check: Role=admin OR Superuser
                sender_is_admin = self.sender.role == 'admin' or self.sender.is_superuser
                
                # DEBUG LOGGING TO FILE
                with open("email_debug.log", "a") as f:
                    f.write(f"\n--- New Message at {self.timestamp} ---\n")
                    f.write(f"Sender: {self.sender} (Role: {self.sender.role}, Superuser: {self.sender.is_superuser})\n")

                recipient_list = []

                if sender_is_admin:
                     # Admin sent this -> Email the receiver (Staff)
                    if self.receiver and self.receiver.email:
                        recipient_list = [self.receiver.email]
                else:
                    # Staff sent this -> Do NOT email Admins (requested by user)
                    recipient_list = []
                    
                    with open("email_debug.log", "a") as f:
                         f.write(f"Staff message sent. No email notification to admins.\n")

                if recipient_list:
                    from django.core.mail import EmailMessage
                    try:
                        email = EmailMessage(
                            subject=subject,
                            body=body,
                            from_email=f"{sender_name} <{settings.EMAIL_HOST_USER}>",  # Shows Staff Name, sends from System Email
                            to=recipient_list,
                            reply_to=[sender_email]
                        )
                        email.send(fail_silently=False)
                        
                        with open("email_debug.log", "a") as f:
                            f.write("Email sent successfully using EmailMessage!\n")
                    except Exception as e:
                        with open("email_debug.log", "a") as f:
                            f.write(f"SMTP ERROR: {str(e)}\n")
                else:
                    with open("email_debug.log", "a") as f:
                        f.write("No recipients found to email.\n")

            except Exception as e:
                with open("email_debug.log", "a") as f:
                    f.write(f"GENERAL ERROR: {str(e)}\n")
