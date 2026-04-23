const paginate = require('../utils/paginate');

// Factory: create CRUD handlers for a given model
const createCRUD = (Model, searchFields = ['name']) => ({

  getAll: async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.search) {
        const regex = new RegExp(req.query.search, 'i');
        filter.$or = searchFields.map(f => ({ [f]: regex }));
      }
      const result = await paginate(Model, filter, req.query);
      res.json({ success: true, ...result });
    } catch (err) { next(err); }
  },

  getOne: async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: doc });
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const doc = await Model.create({ ...req.body, createdBy: req.user?._id });
      res.status(201).json({ success: true, data: doc });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: doc });
    } catch (err) { next(err); }
  },

  remove: async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) { next(err); }
  },
});

module.exports = createCRUD;
