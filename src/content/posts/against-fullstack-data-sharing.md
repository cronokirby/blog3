---
title: "Against Fullstack Data Sharing"
date: 2020-02-13
description: "The unintuitive reasons why webapps written in a common language shouldn't share data formats"
draft: false
path: "/posts/against-fullstack-data-sharing"
type: post
image: "/print14.jpg"
tags:
  - "Programming"
  - "Frontend"
  - "Backend"
  - "Javascript"
  - "Graphql"
---

This is a post about how I work with data in fullstack development. Specifically, I share what I think are
good patterns for sharing data and logic between the frontend and the backend of an application.
Initially, I was for sharing a lot of logic, classes, and data formats between a frontend and backend
written in the same language, but I've come to change my mind after trying it out on a real project. This
post talks about that experience as well.

# Fullstack what now?

As the title indicates, I'm against *Fullstack Data Sharing*, but what exactly do I mean by that?
I struggled to summarize the idea in a few words for the title, so let me give a more detailed
explanation of what I mean.

I like building apps on the web, using Javascript. Or rather, Typescript, but the process and libraries
are the same. One advantage of JS is that you can have the same language for the backend, and
frontend of your application. The backend is the code that you, the developer, are responsible for
running, and the frontend is what you send to the users of your application. The backend code is
usually run on some kind of server, and most of its work centers around a database. The frontend
presents the functionality of the backend in a nice package for the user.

Anyways, you need to *do things* on both sides, and you always have common data between the sides.
For example, if I'm making a twitter clone, the concept of a "Tweet" exists on both the backend,
and the frontend. The backend will need to create and retrieve Tweets using the database,
and the frontend will need to display Tweets to the user, and allow them to create Tweets, etc.
You need code to handle and manipulate this data on both sides, as well as ways to transfer
things between both sides.

## At least 2 serialization formats

Let's focus a little bit on *serialization*: transforming your code's representation of data
into something that can be sent over the wire, or stored into a database. There's 2 main places
you need to serialize your data in a web application:

  - Moving data into the database
  - Moving data between the backend and the frontend

### JSON on the pipes

For moving data between the backend and the frontend, in 2020 the ubiquitous format is JSON. If it
were 2004, maybe I'd be saying XML instead, but those days are past us. Regardless of whether
you use GraphQl, REST, or gRPC, or even something else, you'll be using JSON, or something like JSON
to zip data to and from. What allows JSON to represent pretty much everything, albeit sometimes
a bit shabbily, is having maps, strings, and lists. For example:

```json
{
  "type": "post",
  "data": {
    "created-at": "2020-02-12",
    "message": "Hello World!",
  }
  "replies": ["23424234", "3234234234"]
}
```

This is an example of a JSON structure, and it showcases how we can represent a lot of nifty things
with a relatively simple format. JSON is sufficient to represent a lot of our data structures.

Another advantage of JSON with JS, is that we can directly serialize (simple) JS objects to JSON:

```js
// {"foo": "bar"}
JSON.stringify({foo: "bar"})
```

there are some caveats with this approach I'll get into a bit later, but for now we'll put a tick
in the "advantages" column.

### ORMs in the front
