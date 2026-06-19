package com.sanacodes.joblisting.repository;

import com.sanacodes.joblisting.model.Post;

import java.util.List;

public interface SearchRepository {

    List<Post> findBytext(String text);
}
