import Form from '../models/Form.js';
export async function addForm(req, res) {
  try {
    const form = new Form(req.body);
    await form.save();
    res.json({ message: 'Form data saved',status:"success" });
  } catch (err) {
    res.status(500).json({ message: 'Form save error', error: err.message });
  }
}

export async function getForms(req, res) {
    const { start, end, limit } = req.query;
    console.log("Query Params:", req.query);
    console.log("Start:", start, "End:", end, "Limit:", limit);
  
    try {
        const query = {
            createdAt: { $gte: new Date(Number(start)), $lte: new Date(Number(end)) }
          };
  
      let formQuery = Form.find(query).sort({ createdAt: -1 }); // Sort by latest first
  
      if (limit) {
        formQuery = formQuery.limit(Number(limit));
      }
  
      const forms = await formQuery;
      res.json(forms);
    } catch (err) {
        console.error("Error fetching forms:", err);
      res.status(500).json({ message: 'Fetch error' });
    }
  }
  
