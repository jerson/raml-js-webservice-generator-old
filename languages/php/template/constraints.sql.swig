{{ (schema | uniqueKeys(name)) | raw }}
{#{{ (schema | primaryKeys(name)) | raw }}#}
{#{{ (schema | autoIncrements(name)) | raw }}#}
{{ (schema | foreignKeys(name,schemas)) | raw }}