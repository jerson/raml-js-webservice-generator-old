<?php

namespace Form;

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
    { {% for propertyName,property in schema.properties %}{% if property | canBeColumn(schema,schemas) and not (propertyName | isPrimaryKey(schema)) %}
        {% set type = property.type %}
        {% if type == 'date' %}
            $builder->add('{{ propertyName }}', 'date', array(
            'widget' => 'single_text',
            'format' => 'yyyy-MM-dd',
            ));
        {% elseif type == 'datetime' %}
            $builder->add('{{ propertyName }}', 'date', array(
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd H:mm',
            ));
        {% elseif type == 'timestamp' %}
            $builder->add('{{ propertyName }}', 'date', array(
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd H:mm',
            ));
        {% else %}
            $builder->add('{{ propertyName }}');
        {% endif %}

    {% endif %}{% endfor %}
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
