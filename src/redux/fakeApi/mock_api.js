import {Model, createServer} from 'miragejs';

export const setUpServer = () => {
  return createServer({
    models: {
      subject: Model,
    },

    seeds(server) {
      server.create('subject', {id: '1', name: 'HTML'});
      server.create('subject', {id: '2', name: 'JS'});
      server.create('subject', {id: '3', name: 'TS'});
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
        return schema.subjects.create(attrs);
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
