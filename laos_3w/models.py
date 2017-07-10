from django.db import models


class Status(models.Model):

    status = models.CharField(max_length=50)

    def __unicode__(self):
        return self.status

    class Meta:
        db_table = 'status'


class Province(models.Model):

    pcode = models.IntegerField()
    name = models.CharField(max_length=120)
    name_l = models.CharField(max_length=120)
    longitude = models.FloatField()
    latitude = models.FloatField()

    def __unicode__(self):  # Python 3: def __str__(self):
        return self.name

    class Meta:
        db_table = 'provinces'


class Test(models.Model):

    name = models.CharField(max_length=120)

    def __unicode__(self):  # Python 3: def __str__(self):
        return self.name

    class Meta:
        db_table = 'tests'