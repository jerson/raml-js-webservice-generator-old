# raml-js-schema-generator
RAML schema generator

[![Support via Gittip](https://rawgithub.com/twolfson/gittip-badge/0.2.0/dist/gittip.png)](https://www.gittip.com/jerson/)


##RAML Example

```YAML

#%RAML 0.8

title: World Video API
baseUri: http://example.api.com/{version}
version: v1
schemas:
 - actor: !include actor.schema
 - genre: !include genre.schema
 - movie: !include movie.schema
 - news: !include news.schema
 - autor: !include autor.schema

```

##Output Schema
![consola](https://github.com/jerson/raml-js-schema-generator/raw/master/doc/images/schema.png "Schema Generado")