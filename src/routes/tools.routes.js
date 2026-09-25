import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { tools, CATEGORIES } from '../data/tools.js';
import { validateTool } from '../middleware/validate-tool.js';

// app.js mounts this router at /api/tools, so the paths below start after that:
// '/' here means /api/tools, and '/:id' means /api/tools/<some id>.
export const toolsRouter = Router();
//step 2
toolsRouter.get('/', (req, res) => {
  const category = req.query.category;

  if (category === undefined) {
    return res.json({ data: tools });
    
  }
if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: { message: 'category must be one of: power, hand, garden, cleaning' } });
  } 
  const matching = tools.filter((tool) => tool.category === category);
  res.json({ data: matching });
});
//step 3
toolsRouter.get('/:id', (req, res) => {
  const tool = tools.find((tool) => tool.id === req.params.id);

  if (!tool) {
    return res.status(404).json({ error: { message: 'Tool not found' } });
  }

  res.json({ data: tool });
});

//step 5
toolsRouter.post('/', validateTool, (req, res) => {
  const tool = { id: randomUUID(), ...req.body };
  tools.push(tool);
  res.status(201).json({ data: tool });
});
//step 6
toolsRouter.put('/:id', validateTool, (req, res) => {
  const tool = tools.find((tool) => tool.id === req.params.id);

  if (!tool) {
    return res.status(404).json({ error: { message: 'Tool not found' } });
  }

  Object.assign(tool, req.body);
  res.json({ data: tool });
});
//step 7
toolsRouter.delete('/:id', (req, res) => {
  const index = tools.findIndex((tool) => tool.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: { message: 'Tool not found' } });
  }

  tools.splice(index, 1);
  res.status(204).end();
});
