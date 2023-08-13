import {nanoid} from '@reduxjs/toolkit';
import {Model, createServer} from 'miragejs';

export const setUpServer = () => {
  return createServer({
    models: {
      subject: Model,
    },

    seeds(server) {
      server.create('subject', {id: nanoid(), name: 'HTML'});
      server.create('subject', {id: nanoid(), name: 'JS'});
      server.create('subject', {id: nanoid(), name: 'CSS'});
      server.create('subject', {id: nanoid(), name: 'NodeJS'});
    },

    routes() {
      this.get('/api/subjects', schema => {
        return schema.subjects.all();
      });

      this.get('/api/subjects/:id', (schema, request) => {
        let id = request.params.id;
        return schema.subjects.find(id);
      });

      this.post('/api/subjects', (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.subjects.create({...attrs, id: nanoid()});
      });

      this.delete('/api/subjects/:id', (schema, request) => {
        let id = request.params.id;
        return schema.subjects.find(id).destroy();
      });

      this.put('/api/subject/:id', (schema, request) => {
        let id = request.params.id;
        let {name} = JSON.parse(request.requestBody);
        return schema.subjects.find(id).update({name});
      });
    },
  });
};
