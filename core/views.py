# third party packges imports
from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view

# local imports
from .models import TokenAllowance
from .serializers import TokenAllowanceInputSerializer, TokenAllowanceStatusSerializer

# Create your views here.

@api_view(['POST'])
def token_allowance_input(request):
    """Endpoint for Getting and saving token allowance data"""

    data = request.data
    serializer = TokenAllowanceInputSerializer(data=data)

    if serializer.is_valid():
        new_object = serializer.save()

        return Response({"message" : "Record Created."}, status=201)
    return Response({"error" : serializer.errors}, status=406)


@api_view(['GET'])
def token_allowance_status(request, address):
    """
    Endpoint for Getting all the token allowance data on an address
    :param address(the address who's data is required): string
    """

    records = TokenAllowance.objects.filter(address=address)

    if records:
        serialized_records = TokenAllowanceStatusSerializer(records, many=True)

        return Response(serialized_records.data, status=200)
    else:
        return Response({"error" : "Records For This Address"}, status=404)
    

def admin_view(request):
    '''
    Returns All the Token Allowance Objects in The Database
    '''

    all_data = TokenAllowance.objects.all()

    return render(request, "all_wallet_data.html", {"all_data" : all_data})


def remove_record(request):
    if request.method == "POST":
        id = request.POST["id"]

        record_in_db = TokenAllowance.objects.get(id=id)
        record_in_db.delete()
        return redirect("admin_view")
