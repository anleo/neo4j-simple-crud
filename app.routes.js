let dbEnv = process.env.NODE_ENV === 'develop' ? 'neo4j' : 'localhost';
let dbLink = `http://neo4j:neo4j@${dbEnv}:7474`;
let neo4j = require('neo4j');
let db = new neo4j.GraphDatabase(dbLink);

let moment = require('moment');

module.exports = function (app, express) {
  let router = express.Router();

  router.post('/api/posts/new', function (req, res) {
    req.body['createdAt'] = Date.now();

    db.cypher({
      query: `
        CREATE (post:Post {body}) 
        RETURN post
      `,
      params: {
        body: req.body
      }

    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }
      if (!results || !results.length) {
        return res.status(200).send(null);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['post'];
          res.send(post);
        }
      }
    });

  });
  router.put('/api/posts/:postId', function (req, res) {
    db.cypher({
      query: `
        MATCH (post:Post) 
        WHERE ID(post) = ${req.params.postId}
        SET post.title = {title}
        SET post.body = {body}
        RETURN post
      `,
      params: {
        title: req.body.title,
        body: req.body.body,
      }
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }
      if (!results || !results.length) {
        return res.status(200).send(null);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['post'];
          res.send(results);
        }
      }
    })
  });

  router.delete('/api/posts/:postId', function (req, res) {
    db.cypher({
      query: `
        MATCH (post:Post)
        WHERE ID(post) = ${req.params.postId}
        OPTIONAL MATCH (post)-[r:ChildComment]->(comment:Comment)
        DETACH DELETE post, comment
        RETURN post, comment
      `
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }

      if (!results || !results.length) {
        return res.status(200).send([]);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['post'];
          res.send({message: 'post was deleted'});
        }
      }
    });
  });

  router.get('/api/posts/:postId', function (req, res) {
    db.cypher({
      query: `
        MATCH (post:Post)
        WHERE ID(post) = ${req.params.postId}
        WITH post
        RETURN post
      `
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }

      if (!results || !results.length) {
        return res.status(200).send(null);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['post'];
          res.send(post);
        }
      }
    });
  });

  router.get('/api/posts/:postId/comments', function (req, res) {
    let postId = req.params.postId;

    let queryOld = `
      MATCH (comment:Comment)
      WITH comment
      ORDER BY comment.createdAt
      RETURN comment
    `;

    let queryNew = `
      MATCH (post: Post)-[:ChildComment]->(comment: Comment) 
      WHERE ID(post) = ${postId}
      WITH comment, min(comment.createdAt) as Created
      ORDER BY Created
      RETURN comment
    `;

    db.cypher({
      query: queryNew
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }

      if (!results || !results.length) {
        return res.status(200).send([]);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['comment'];
          res.send(results);
        }
      }
    });
  });
  router.get('/api/posts', function (req, res) {
    db.cypher({
      query: `
        MATCH (post:Post)
        WITH post
        ORDER BY post.createdAt
        SET post.commentsCounter = SIZE((post)-[:ChildComment]->())
        RETURN post
      `
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }

      if (!results || !results.length) {
        return res.status(200).send([]);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['post'];

          res.send(results);
        }
      }
    });
  });
  router.post('/api/posts/:postId/comments/new', function (req, res) {
    let postId = req.params.postId;
    req.body['createdAt'] = Date.now();

    db.cypher({
      query: `
        MATCH (post:Post) 
        WHERE ID(post) = ${postId}
        CREATE (comment:Comment {data}) 
        CREATE (comment)-[:ParentPost]->(post)
        CREATE (post)-[:ChildComment]->(comment)
        RETURN comment
      `,
      params: {
        data: req.body
      }

    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }
      if (!results || !results.length) {
        return res.status(200).send(null);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['comment'];
          res.send(post);
        }
      }
    });
  });

  router.put('/api/comments/:commentId', function (req, res) {
    db.cypher({
      query: `
        MATCH (comment:Comment) 
        WHERE ID(comment) = ${req.params.commentId}
        SET comment.text = {text}
        RETURN comment
      `,
      params: {
        text: req.body.text
      }
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }
      if (!results || !results.length) {
        return res.status(200).send(null);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['comment'];
          res.send(results);
        }
      }
    })
  });

  router.delete('/api/comments/:commentId', function (req, res) {
    db.cypher({
      query: `
        MATCH (comment:Comment)
        WHERE ID(comment) = ${req.params.commentId}
        WITH comment, comment._id AS doc
        DETACH DELETE comment
        RETURN doc
      `
    }, (err, results) => {
      if (err) {
        return res.status(500).send(err, err && err.message);
      }

      if (!results || !results.length) {
        return res.status(200).send([]);
      } else {
        let result = results[0];
        if (!result) {
          return res.status(400).send(err, err && err.message);
        } else {
          let post = result['comment'];
          res.send({message: 'comment was deleted'});
        }
      }
    });
  });

  app.use(router)
};
