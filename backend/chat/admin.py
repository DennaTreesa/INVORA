from django.contrib import admin
from .models import ChatMessage

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'message', 'timestamp', 'is_read')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('sender__username', 'receiver__username', 'message')
    
    # Allow Admins to create messages easily
    def save_model(self, request, obj, form, change):
        if not obj.sender_id:
            obj.sender = request.user
        super().save_model(request, obj, form, change)
