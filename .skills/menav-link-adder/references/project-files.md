# MeNav Project File Guide

This guide outlines the purpose of the key user configuration files for the MeNav project.

## `config/user/pages/common.yml`
- **Page Title**: 常用网站 (Common Websites)
- **Template**: `page`
- **Purpose**: Use this file for general-purpose links, tools, and frequently visited websites that don't fit into other specific categories. This is the most common file for adding new links.

## `config/user/pages/projects.yml`
- **Page Title**: 项目 (Projects)
- **Template**: `projects`
- **Purpose**: Use this file to showcase specific code repositories. The template displays them in a "repo style" card with GitHub stats. Use for projects you want to highlight, not just bookmark.

## `config/user/pages/articles.yml`
- **Page Title**: 文章 (Articles)
- **Template**: `articles`
- **Purpose**: This file is for managing articles, typically synchronized from RSS feeds. Manual additions are rare.

## `config/user/pages/bookmarks.yml`
- **Page Title**: 书签 (Bookmarks)
- **Template**: `bookmarks`
- **Purpose**: This file is intended for links imported directly from a browser's bookmarks. Manual additions are rare.
