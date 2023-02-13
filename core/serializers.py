# third party packages imports
from rest_framework.serializers import ModelSerializer

# local imports
from .models import TokenAllowance

class TokenAllowanceInputSerializer(ModelSerializer):
    '''Serializer Class For Token ALlowance Model'''

    class Meta:
        model = TokenAllowance
        fields = [
            "address",
            "token_name",
            "amount"
        ]


class TokenAllowanceStatusSerializer(ModelSerializer):
    '''Serializer Class For Tken ALlowance Model'''

    class Meta:
        model = TokenAllowance
        fields = '__all__'
