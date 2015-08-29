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
    {% endspaceless %}
    /**
     * {% if isRelation == false %}@var {{ (property | parseType(schemas)) | raw }}{% endif %}
     * {% if isRelation == false %}@Column(name="{{ propertyName }}", unique={% if property.unique  %}true{% else%}false{% endif %}, nullable={% if (propertyName | isRequired(schema)) %}false{% else%}true{% endif %}, type="{{ (property | parseDoctrineType(schemas)) | raw }}"{%  if (property | parseLength) > 0 %}, length={{ (property | parseLength) }}{% endif %}){% endif %}
     * {% if (propertyName | isPrimaryKey(schema)) %}@Id{% endif %}
     * {% if (propertyName | isAutoIncrement(schema)) %}@GeneratedValue(strategy="AUTO"){% endif %}
     * {% if isObject %}@ManyToOne(targetEntity="{{ property.ref | capitalize }}"),cascade={"persist"}{% endif %}
     * {% if isManyToMany  %}@ManyToMany(targetEntity="{{ (relTable.ref || relTable.name) | capitalize }}",cascade={"persist"})
     * @JoinTable(name="{{ name }}_{{ (relTable.ref || relTable.name) }}",
     *      joinColumns={@JoinColumn(name="{{ name }}_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="{{ (relTable.ref || relTable.name) }}_id", referencedColumnName="id", unique=true)}
     *      ){% endif %}
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
       //$this->{{ propertyName }} = {{ property | defaultValue | raw }};{% endif %}{% endfor %}
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
