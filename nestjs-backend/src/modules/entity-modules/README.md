# About entity modules

- It's a manager of a single entity/table: A module that ONLY handles the data of one table
- It has always a repository (to manipulate the table's data)
- It can have a controller (not necessarily) in case the controller ONLY needs the service of the entity-module

Entity modules are imported to `feature-modules` to build features.

See ../feature-modules/README.md
