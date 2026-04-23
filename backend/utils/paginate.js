/**
 * Build pagination metadata and apply skip/limit to a Mongoose query.
 * @param {Object} model  - Mongoose model
 * @param {Object} filter - Mongoose filter object
 * @param {Object} query  - Express req.query
 * @param {Array}  populate - fields to populate (optional)
 */
const paginate = async (model, filter = {}, query = {}, populate = []) => {
  const page  = Math.max(parseInt(query.page)  || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 100);
  const skip  = (page - 1) * limit;

  let q = model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
  populate.forEach(p => { q = q.populate(p); });

  const [data, total] = await Promise.all([q, model.countDocuments(filter)]);

  return {
    data,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

module.exports = paginate;
