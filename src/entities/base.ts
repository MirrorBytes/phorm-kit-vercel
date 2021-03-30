import { Entity, PrimaryKey, Property, BaseEntity } from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity({ abstract: true })
@ObjectType({ isAbstract: true })
export abstract class Base<T extends { id: string }> extends BaseEntity<T, 'id'> {
	@Field(() => ID)
	@PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
	readonly id!: string;

	@Field(() => Date)
	@Property()
	createdAt: Date = new Date();

	@Field(() => Date)
	@Property({ onUpdate: () => new Date() })
	updatedAt: Date = new Date();
}
