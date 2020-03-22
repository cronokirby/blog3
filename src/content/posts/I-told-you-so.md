---
title: '"I told you so"'
date: 2020-03-22T15:02:23.365Z
description: "A few use cases for cryptographic hashes"
draft: false
path: "/posts/I-told-you-so"
image: "/print15.jpg"
type: post
tags:
  - "Software"
  - "technology"
---

How cryptographic hashes can prove your prescience, and other fun applications.

# Tweeting a blob of bytes

![](/I-told-you-so-1.png)

In this tweet, Patrick tells us who knows something. We don't know what he
knows, and we won't know it until he tells us in a month. Yet, if you understand
the "idiom" that he posted in the first tweet, you'll know that he wasn't lying
to us.

When he releases the information to us in a month, we'll
have the proof that he already knew it today. The proof's in the pudding,
and the big blob of bytes is the pudding.

This post is about understanding what that blog represents, and why it lets
us prove that Patrick is really demonstrated prescience, rather than pulling
the wool over our eyes.

# Hashes

That big blob is what is called a *hash*. If you've done a bit of programming
or studied some Computer Science, you might have heard of this term before.
If you've even heard of a *Cryptographic Hash*, then there's not much I'll
be able to teach you today 😃.

There are a few common places where you might have heard the term "hash":
  - Hash tables
  - Password hashes
  - Crytographic hashes

All of three of these same the same structure, but vary in properties.

A *hash* is a function, taking elements from one set *(Big)* and
mapping them to another set *(Small)*:

![](/I-told-you-so-2.png)

Now, because this is a *function*, every element `x` maps to some element
`hash(x)`. It's usually the case that the input set has more element
than our output set, otherwise our hash wouldn't have much difficulty
doing its job.

Where these different types of hashes differ is in what extra properties
they demand or would like to have.

## Hash Tables

The basic idea with hash tables is that if you have a small amount of elements,
you can just create an array with a reserved slot for each elements. This
data structure would allow fast retrieval and insertion of elements.

The problem is that you might not have a small set of elements. For example,
there are billions of integers, and strings are essentially infinite. So
we need a way to take this big set, and map it onto a smaller set, for which
we can reserve an array.

This is why we use a hash function.

For hash tables, the hash function doesn't need to have any properties per
se, but we'd like the following:

### Hashing should be fast   

Since we're using hash tables as a pretty general purpose data structure,
we'd like our implementation to be fast. If hashing is slow, then so is
our data structure. Basically every operation on a hash table involves
calculating a hash, so we'd like our hashing to be speedy.

### Collisions should be rare

Because the output set is smaller than the input set, the hashing function
will necessarily produce collisions. A collision is when two different
input elements share the same hash. When you have more pigeons than holes,
two pigeons will have to share a hole.

If every element in a hash table collides, we no longer get instant retrieval,
but instead get something more like linear retrieval, where we have to start
searching through lists containing all the elements that collided to
the same slot. (Not all hash tables have collision lists, but the principle
of degrading performance remains the same).

Ideally, we'd like the probability of a given element being assigned a certain
slot to be uniform. That is to say, we'd like their to not be a bias towards
certain outputs of the hash function.
