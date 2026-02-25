from django.urls import path
from .views import ChatHistoryView, SendMessageView, ActiveChatUsersView

urlpatterns = [
    path('history/', ChatHistoryView.as_view(), name='chat-history'),
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('users/', ActiveChatUsersView.as_view(), name='active-chat-users'),
]
