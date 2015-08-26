<?php

namespace Form;

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
        $builder->add('{{ propertyName }}');{% endif %}{% endfor %}
    }


    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Entity\{{ name | capitalize }}',
        ));
    }

    public function getName()
    {
        return '{{ name }}';
    }

}
