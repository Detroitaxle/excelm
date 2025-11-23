-- Add agent_action column for agent actions: refunded, closed, no wh, replacement requested
alter table public.orders_from_tsv 
add column if not exists agent_action text;

-- Create index for agent_action if needed for filtering
create index if not exists idx_orders_agent_action on public.orders_from_tsv(agent_action);

