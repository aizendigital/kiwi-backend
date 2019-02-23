import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const translationSchema = new Schema({
  origin_lang: {
    type: String,
    required: [true, 'word must have origin language. like "fa" for Farsi'],
  },
  translation_lang: {
    type: String,
    required: [true, 'word must have translation language. like "en" for English'],
  },
  word: {
    type: String,
    required: [true, 'word is required'],
  },
  translation: {
    type: String,
    required: [true, 'word translation is required'],
  }
});
translationSchema.plugin(mongoosePaginate);
export default mongoose.model('Translation', translationSchema);
