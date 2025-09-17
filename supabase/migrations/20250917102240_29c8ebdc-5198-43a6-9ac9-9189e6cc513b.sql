-- Remove duplicate alumni role for the admin user
DELETE FROM user_roles 
WHERE user_id = '19c2cac5-f06e-4b3f-9186-50e9b3800ac0' 
AND role = 'alumni';

-- Add unique constraint to prevent duplicate roles per user in the future  
ALTER TABLE user_roles ADD CONSTRAINT unique_user_role UNIQUE (user_id);