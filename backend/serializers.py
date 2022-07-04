from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('pk', 'user', 'money', 'referral_link', 'referral_amount', 'missed_amount', 'wallet')

    def create(self, validated_data):
        return Profile.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.money = validated_data.get('money', instance.money)
        instance.referral_amount = validated_data.get('referral_amount', instance.referral_amount)
        instance.missed_amount = validated_data.get('missed_amount', instance.missed_amount)
        if instance.wallet is None:
            instance.wallet = validated_data.get('wallet', instance.wallet)
        instance.save()
        return instance
