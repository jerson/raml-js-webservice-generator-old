<?php

namespace Form;

use Entity;
use Form\DataTransformer\EntityToIdTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class {{ name | capitalize }}Type extends AbstractType
{

    /**
     * buildForm {{ name | capitalize }}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        {% for propertyName,property in schema.properties %}{% if property | canBeColumn(schema,schemas) and not (propertyName | isPrimaryKey(schema)) %}
        {% spaceless %}

            {% set isObject = property.type=='object' %}
            {% set relTable = '' %}
            {% if property.type=='array' and property.items and property.items[0].type=='object' %}
                {% set relTable = property.items[0] %}
                {% set isManyToMany = true %}
            {% else %}
                {% set isManyToMany = false %}
            {% endif %}
            {% if isObject or isManyToMany %}
                {% set isRelation = true %}
            {% else %}
                {% set isRelation = false %}
            {% endif %}

        {% set type = property.type %}
        {% if type == 'date' %}
            $builder->add('{{ propertyName }}', 'date', array(
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
                'required' => {% if (propertyName | isRequired(schema)) %}true{% else%}false{% endif %},
            ));
        {% elseif type == 'datetime' %}
            $builder->add('{{ propertyName }}', 'date', array(
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd H:mm',
            'required' => {% if (propertyName | isRequired(schema)) %}true{% else%}false{% endif %},
            ));
        {% elseif type == 'timestamp' %}
            $builder->add('{{ propertyName }}', 'date', array(
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd H:mm',
                'required' => {% if (propertyName | isRequired(schema)) %}true{% else%}false{% endif %},
            ));
        {% elseif isObject %}
            $builder->add('{{ propertyName }}', 'entity', array(
                'class' => 'Entity\{{ property.ref | capitalize }}',
                //'property' => 'id',
                'required' => {% if (propertyName | isRequired(schema)) %}true{% else%}false{% endif %},
            ));
        {% elseif isManyToMany %}
            $builder->add('{{ propertyName }}', 'entity', array(
                'class' => 'Entity\{{ (relTable.ref || relTable.name) | capitalize }}',
                //'property' => 'id',
                'multiple' => true,
                'required' => {% if (propertyName | isRequired(schema)) %}true{% else%}false{% endif %},
            ));
        {% else %}
            $builder->add('{{ propertyName }}','text', array(
                'required' => {% if (propertyName | isRequired(schema)) %}true{% else%}false{% endif %},
            ));
        {% endif %}{% endspaceless %}{% endif %}{% endfor %}
    }


    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'csrf_protection'   => false,
            'allow_extra_fields' => true,
            'data_class' => 'Entity\{{ name | capitalize }}',
        ));

    }

    public function getName()
    {
       // return '{{ name }}';
    }

}
