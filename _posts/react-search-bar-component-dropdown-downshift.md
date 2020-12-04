---
type: 'post'
title: 'React Search Bar Component Dropdown With Downshift'
excerpt: 'Learn how to create a search bar component with React and Downshift. A free tutorial to boost your React and JavaScript web development skills.'
coverImage: '/assets/blog/react-search-bar-component-dropdown-downshift/cover.jpg'
date: '2020-12-04'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

## Introduction

An in-site search feature is all but mandatory for many website genres. Whether you are building a blog, ecommerce, or social media site, giving a user the ability to quickly find the content they want greatly improves the site's quality and user experience. Note to self, I need to add search to this site! In any event, this tutorial will walk through the coding of a search bar component using [React](), a JavaScript library for building user interfaces. The search input will live in the site header and feature a dropdown that previews search results. We will polish off our React search bar component by adding highlighting and extra category results. Here is what the finished project will look like.

## Environment

For this tutorial, I will be using [CodeSandbox](), a free online development environment. Feel free to code along with me there, or use your own tools. Get started by creating a new sandbox based on the React template. This sets the project up with a basic file structure and dependencies. Use the `Add Dependencies` button to include [downshift](), [styled-components](), and [lodash.debounce]().