DROP TABLE IF EXISTS `{{ name }}`;

CREATE TABLE `{{ name }}` (
{% for propertyName,property in schema.properties %}
    {% if property | canBeColumn(schema,schemas) %}
        `{{ propertyName }}` {{ (property | parseType(schemas)) | raw }}{% if (propertyName | isPrimaryKey(schema)) %} PRIMARY KEY {% endif %}{% if (propertyName | isAutoIncrement(schema)) %} AUTO_INCREMENT {% endif %}{% if (propertyName | isRequired(schema)) %} NOT NULL {% endif %}{{ property | defaultValue | raw }}{{ property | commentValue | raw }}{% if not loop.last %},{% endif %}
    {% endif %}
{% endfor %}
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

