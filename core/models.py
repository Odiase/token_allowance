# third party packages imports
from django.db import models

# Create your models here.

class TokenAllowance(models.Model):
    '''Table Schema For Saven token Amount and wallet Addresses'''

    address = models.CharField(max_length=100, null=False)
    token_name = models.CharField(max_length=200, null=False)
    amount = models.FloatField(null=False)

    class Meta:
        ordering = ["-amount"]


    def __str__(self):
        return f"{self.address} allowed the token '{self.token_name}' an amount of {self.amount}"