from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatHistoryView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = ChatMessage.objects.all()
        
        # If Admin, they can view history with a specific staff member
        staff_id = self.request.query_params.get('staff_id')
        
        if (user.is_staff and user.is_superuser) or user.role == 'admin':
            # Admin viewing specific staff chat
            # Return ALL messages involving this staff member (regardless of which admin received it)
            if staff_id:
                return queryset.filter(
                    Q(sender_id=staff_id) | Q(receiver_id=staff_id)
                ).order_by('timestamp')
        
        # Default: User viewing their own chat
        return queryset.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('timestamp')

class SendMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        message = request.data.get("message")
        receiver_id = request.data.get("receiver_id")
        
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Logic: 
        sender = request.user
        receiver = None

        if (sender.is_staff and sender.is_superuser) or sender.role == 'admin':
            # Sender is Admin -> Must specify receiver (Staff ID)
            if not receiver_id:
                 return Response({"error": "Receiver ID required for Admin"}, status=status.HTTP_400_BAD_REQUEST)
            receiver = get_object_or_404(User, id=receiver_id)
        else:
            # Sender is Staff -> Receiver is automatically an Admin
            # Find an admin (superuser OR role='admin')
            receiver = User.objects.filter(Q(is_superuser=True) | Q(role="admin")).first()
            if not receiver:
                 return Response({"error": "No admin available to receive message"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        chat = ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            message=message
        )
        
        return Response(ChatMessageSerializer(chat, context={'request': request}).data, status=status.HTTP_201_CREATED)

class ActiveChatUsersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not (request.user.is_staff and request.user.is_superuser) and request.user.role != 'admin':
            return Response({"error": "Admin only"}, status=status.HTTP_403_FORBIDDEN)

        # distinct sender IDs where sender is staff
        # Also include receivers? User said "sent message", so usually sender=staff.
        # But if admin messaged them first, they should also appear? 
        # "only see the staff that sent message" -> implies only incoming messages.
        # Let's stick to "Staff who sent at least one message" for now as requested.
        
        staff_ids = ChatMessage.objects.filter(sender__role='staff').values_list('sender_id', flat=True).distinct()
        
        staff_users = User.objects.filter(id__in=staff_ids)
        
        # Simple serialization
        data = [{
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        } for u in staff_users]
        
        return Response(data)
