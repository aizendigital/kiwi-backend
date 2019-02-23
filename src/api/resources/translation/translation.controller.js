import Joi from 'joi';
import Translation from './translation.model';
export default {
  // create method for single entities
  async create(req, res) {
    try {
      const schema = Joi.object().keys({
        origin_lang: Joi.string().required(),
        translation_lang: Joi.string().required(),
        word: Joi.string().required(),
        translation: Joi.string().required(),
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.status(400).json(error);
      }
      const translation = await Translation.create(Object.assign({}, value));
      return res.json(translation);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  // import method for json file upload
  async import(req, res) {
    var fs = require('fs')
    try {
      fs.readFile(req.file.path, function (err, data) {
        if (err) throw err;
        let fileContent = JSON.parse(data);
        fileContent.forEach(function(element) {
            const schema = Joi.object().keys({
              origin_lang: Joi.string().required(),
              translation_lang: Joi.string().required(),
              word: Joi.string().required(),
              translation: Joi.string().required(),
            });
            const { value, error } = Joi.validate(element, schema);
            if (error && error.details) {
              return res.status(400).json(error);
            }
            Translation.create(Object.assign({}, value));
        });
        // delete file
        fs.unlink(req.file.path, function (err) {
          if (err) throw err;
        });      
      });
      return res.status(200).json('Content Imported to database');
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  // find and return all words from db
  async findAll(req, res) {
    try {
      const { origin_lang,translation_lang,page, perPage } = req.query;
      const query = { 
        $or: [ { origin_lang: origin_lang }, { translation_lang: translation_lang } ] 
      }
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
      };
      const translations = await Translation.paginate(query, options);
      return res.json(translations);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  // find one translation based on word
  async findOneByWord(req, res) {
    try {
      const { word } = req.params;
      const query = { 
        $or: [ { word: word }, { translation: word } ] 
      }
      const translation = await Translation.find(query);
      if (!translation) {
        return res.status(404).json({ err: 'could not find translation' });
      }
      return res.json(translation);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  // find one translation based on id
  async findOne(req, res) {
    try {
      const { id } = req.params;
      const translation = await Translation.findById(id).populate('word');
      if (!translation) {
        return res.status(404).json({ err: 'could not find translation' });
      }
      return res.json(translation);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  
  // delete a translation
  async delete(req, res) {
    try {
      const id  = req.params.id;
      const query = { 
        _id: id
      }
      const translation = await Translation.findOneAndRemove(query);  
      if (!translation) {
        return res.status(404).json({ err: 'could not find translation' });
      }
      return res.json(translation);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  // update a translation
  async update(req, res) {
    try {
      const id = req.params.id;
      const query = { 
        _id: id
      }
    
      const schema = Joi.object().keys({
        origin_lang: Joi.string().optional(),
        translation_lang: Joi.string().optional(),
        word: Joi.string().optional(),
        translation: Joi.string().optional(),
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.status(400).json(error);
      }
      const translation = await Translation.findOneAndUpdate(query, value, { new: true });
      if (!translation) {
        return res.status(404).json({ err: 'could not find translation' });
      }
      return res.json("translation updated");
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
