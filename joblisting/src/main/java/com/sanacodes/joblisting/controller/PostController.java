package com.sanacodes.joblisting.controller;

import com.sanacodes.joblisting.repository.PostRepository;
import com.sanacodes.joblisting.model.Post;
import com.sanacodes.joblisting.repository.SearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    PostRepository repo;

    @Autowired
    SearchRepository sr;

    @GetMapping("/allPosts")
    @CrossOrigin
    public List<Post> getAllPosts(){

        return repo.findAll();
    }

    @GetMapping("/posts/{text}")
    @CrossOrigin
    public List<Post> search(@PathVariable String text){
        return sr.findBytext(text);
    }

    @PostMapping("/post")
    @CrossOrigin
    public Post addPost(@RequestBody Post post){
        return repo.save(post);
    }


}
