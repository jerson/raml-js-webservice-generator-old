<?php

namespace Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * {{ name | capitalize }}
 *
 * @Entity
 * @Table(name="{{ name }}")
 */
class {{ name | capitalize }}
{

{% for propertyName,property in schema.properties %}
    {% if property | canBeColumn(schema,schemas) %}
    /**
     * @var {{ (property | parseType(schemas)) | raw }}
     *
     * @Column(name="{{ propertyName }}", type="{{ (property | parseType(schemas)) | raw }}"{%  if (property | parseLength) > 0 %}, length={{ (property | parseLength) }}{% endif %})
     * {% if (propertyName | isPrimaryKey(schema)) %}@Id{% endif %}
     * {% if (propertyName | isAutoIncrement(schema)) %}@GeneratedValue(strategy="AUTO"){% endif %}
     */
    private ${{ propertyName }};
    {% endif %}
{% endfor %}

    /**
     * Contructor {{ propertyName }}
     */
    public function __construct()
    {
    {% for propertyName,property in schema.properties %}{% if property | canBeColumn(schema,schemas) and not (propertyName | isPrimaryKey(schema)) %}
        $this->{{ propertyName }} = {{ property | defaultValue | raw }};{% endif %}{% endfor %}
    }

{% for propertyName,property in schema.properties %}
    {% if property | canBeColumn(schema,schemas) %}
    /**
     * Set {{ propertyName }}
     *
     * @param string ${{ propertyName }}
     * @return {{ name | capitalize }}
     */
    public function set{{ propertyName | capitalize }}(${{ propertyName }})
    {
        $this->{{ propertyName }} = ${{ propertyName }};

        return $this;
    }

    /**
    * Get {{ propertyName }}
    *
    * @return string
    */
    public function get{{ propertyName | capitalize }}()
    {
        return $this->{{ propertyName }};
    }
{% endif %}
{% endfor %}


}
