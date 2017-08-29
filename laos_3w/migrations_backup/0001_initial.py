# -*- coding: utf-8 -*-
# Generated by Django 1.9.12 on 2017-08-21 19:31
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dcode', models.IntegerField()),
                ('name', models.CharField(max_length=120)),
                ('name_l', models.CharField(max_length=120)),
                ('area', models.FloatField()),
            ],
            options={
                'db_table': 'districts',
            },
        ),
        migrations.CreateModel(
            name='Partner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('partner_name', models.CharField(max_length=80)),
            ],
            options={
                'db_table': 'partners',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_code', models.IntegerField()),
                ('project_title', models.CharField(max_length=280)),
                ('year', models.IntegerField()),
                ('date', models.DateField()),
                ('planed_amount', models.FloatField()),
            ],
            options={
                'db_table': 'projects',
            },
        ),
        migrations.CreateModel(
            name='ProjectByProvinces',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('province_amount', models.FloatField()),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='laos_3w.District')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='laos_3w.Project')),
            ],
            options={
                'db_table': 'project_by_provinces',
            },
        ),
        migrations.CreateModel(
            name='Province',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pcode', models.IntegerField()),
                ('name', models.CharField(max_length=120)),
                ('name_l', models.CharField(max_length=120)),
                ('longitude', models.FloatField()),
                ('latitude', models.FloatField()),
            ],
            options={
                'db_table': 'provinces',
            },
        ),
        migrations.CreateModel(
            name='Responsible',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('responsible_name', models.CharField(max_length=80)),
            ],
            options={
                'db_table': 'responsible',
            },
        ),
        migrations.CreateModel(
            name='Sector',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sector_name', models.CharField(max_length=120)),
            ],
            options={
                'db_table': 'sectors',
            },
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'status',
            },
        ),
        migrations.AddField(
            model_name='projectbyprovinces',
            name='province',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='laos_3w.Province'),
        ),
        migrations.AddField(
            model_name='project',
            name='district',
            field=models.ManyToManyField(through='laos_3w.ProjectByProvinces', to='laos_3w.District'),
        ),
        migrations.AddField(
            model_name='project',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_id', to='laos_3w.Partner'),
        ),
        migrations.AddField(
            model_name='project',
            name='province',
            field=models.ManyToManyField(through='laos_3w.ProjectByProvinces', to='laos_3w.Province'),
        ),
        migrations.AddField(
            model_name='project',
            name='responsible',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='x', to='laos_3w.Responsible'),
        ),
        migrations.AddField(
            model_name='project',
            name='sector',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sector_id', to='laos_3w.Sector'),
        ),
        migrations.AddField(
            model_name='project',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='status_id', to='laos_3w.Status'),
        ),
        migrations.AddField(
            model_name='district',
            name='province',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='laos_3w.Province'),
        ),
    ]
