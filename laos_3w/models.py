from django.db import models
from smart_selects.db_fields import ChainedManyToManyField
import datetime

class Status(models.Model):

    status = models.CharField(max_length=50)

    def __unicode__(self):
        return self.status

    class Meta:
        db_table = 'status'
        verbose_name_plural = "statuses"


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
    province = models.ForeignKey(Province, related_name='districts')

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


class Subsector(models.Model):

    other_subsector_name = models.CharField(max_length=80)

    def __unicode__(self):
        return self.other_subsector_name

    class Meta:
        db_table = 'subsectors'


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


class ImplementingPartner(models.Model):

    implementing_partner_name = models.CharField(max_length=120)

    def __unicode__(self):
        return self.implementing_partner_name

    class Meta:
        db_table = 'implementing_partners'


class ProjectByProvinces(models.Model):

    project = models.ForeignKey('Project')
    province = models.ForeignKey(Province)
    district = models.ForeignKey(District, blank=True, null=True)
    # province_amount = models.FloatField()

    class Meta:
        db_table = 'project_by_provinces'
        unique_together = (("project", "province", "district"),)


class Project(models.Model):

    project_code = models.CharField(max_length=40, blank=True, null=True)
    project_title = models.TextField(max_length=280)
    year = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    planed_amount = models.FloatField()
    partner = models.ForeignKey(Partner, related_name='partner_id')
    implementing_partner = models.ManyToManyField(ImplementingPartner)
    # implementing_partner = models.ForeignKey(ImplementingPartner, blank=True, null=True)
    sector = models.ForeignKey(Sector, related_name='sector_id')
    other_subsector = models.ForeignKey(Subsector, blank=True, null=True)

    # planned if start_date > today
    # closed if end_date < today
    # ongoing - everything else

    status = models.ForeignKey(Status, related_name='status_id')
    responsible = models.ForeignKey(Responsible, related_name='responsible_id', blank=True, null=True)
    province = models.ManyToManyField(Province, through='ProjectByProvinces')
    district = models.ManyToManyField(District, through='ProjectByProvinces')

    def __unicode__(self):
        return self.project_title

    def status_code(self):


        print(datetime.datetime.today());
        print(self.start_date);
        print(self.pk);

        if self.start_date > datetime.datetime.today().date():
            return 'Planned'
        elif self.end_date < datetime.datetime.today().date():
            return 'Closed'
        else:
            return 'Ongoing'

    class Meta:
        db_table = 'projects'


class Location(models.Model):

    project = models.ForeignKey(Project, blank=True, null=True, related_name='locations')
    province = models.ForeignKey(Province)
    districts = ChainedManyToManyField(
        District,
        # horizontal=True,
        verbose_name='districts',
        chained_field="province",
        chained_model_field="province",
        related_name='districs')

    class Meta:
        db_table = 'location'