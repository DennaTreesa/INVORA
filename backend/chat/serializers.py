from rest_framework import serializers
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    is_from_me = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'sender_name', 'message', 'timestamp', 'is_from_me']
        read_only_fields = ['sender', 'receiver', 'timestamp']

    def get_is_from_me(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.sender == request.user
        return False
