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

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = 'provinces'


class District(models.Model):

    dcode = models.IntegerField()
    name = models.CharField(max_length=120)
    name_l = models.CharField(max_length=120)
    area = models.FloatField()
    province = models.ForeignKey(Province)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = 'districts'



class Sector(models.Model):

    sector_name = models.CharField(max_length=120)

    def __unicode__(self):
        return self.sector_name

    class Meta:
        db_table = 'sectors'


class Responsible(models.Model):

    responsible_name = models.CharField(max_length=80)

    def __unicode__(self):
        return self.responsible_name

    class Meta:
        db_table = 'responsible'


class Partner(models.Model):

    partner_name = models.CharField(max_length=80)

    def __unicode__(self):
        return self.partner_name

    class Meta:
        db_table = 'partners'


class ProjectByProvinces(models.Model):


    project = models.ForeignKey('Project')
    province = models.ForeignKey(Province)
    district = models.ForeignKey(District, blank=True, null=True)
    province_amount = models.FloatField()


    class Meta:
        db_table = 'project_by_provinces'



class Project(models.Model):

    project_code = models.IntegerField()
    project_title = models.CharField(max_length=280)
    year = models.IntegerField()
    date = models.DateField()
    planed_amount = models.FloatField()
    partner = models.ForeignKey(Partner, related_name='partner_id')
    sector = models.ForeignKey(Sector, related_name='sector_id')
    status = models.ForeignKey(Status, related_name='status_id')
    responsible = models.ForeignKey(Responsible, related_name='x')
    province = models.ManyToManyField(Province, through='ProjectByProvinces')
    district = models.ManyToManyField(District, through='ProjectByProvinces')

    def __unicode__(self):
        return self.project_title

    class Meta:
        db_table = 'projects'