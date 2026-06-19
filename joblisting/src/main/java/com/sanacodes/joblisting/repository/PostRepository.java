package com.sanacodes.joblisting.repository;

import com.sanacodes.joblisting.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post,String> {

}
