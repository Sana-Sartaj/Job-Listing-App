package com.sanacodes.joblisting.repository;

import com.sanacodes.joblisting.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SearchRepImplementation implements SearchRepository {

    @Autowired
    MongoTemplate mongoTemplate;

    @Override
    public List<Post> findBytext(String text) {
        Criteria criteria = new Criteria().orOperator(
                Criteria.where("profile").regex(text, "i"),
                Criteria.where("desc").regex(text, "i"),
                Criteria.where("techs").regex(text, "i")
        );
        return mongoTemplate.find(new Query(criteria), Post.class);
    }
}
