import 'dotenv/config';
import * as joi from 'joi';

export const envsSchema = joi
  .object({
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value: envs } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envsConfig = {
  natsServers: envs.NATS_SERVERS,
  databaseUrl: envs.DATABASE_URL,
};
