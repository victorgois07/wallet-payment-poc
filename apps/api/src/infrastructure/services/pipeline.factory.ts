import { Injectable } from '@nestjs/common';
import type { IPaymentPipeline } from '../../domain/interfaces';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference
import { ParallelPipelineStrategy } from './parallel-pipeline.strategy';
// biome-ignore lint/style/useImportType: Nest DI requires runtime reference
import { SequentialPipelineStrategy } from './sequential-pipeline.strategy';

@Injectable()
export class PipelineFactory {
  constructor(
    private readonly sequentialPipeline: SequentialPipelineStrategy,
    private readonly parallelPipeline: ParallelPipelineStrategy,
  ) {}

  create(strategy: string): IPaymentPipeline {
    if (strategy === 'sequential') {
      return this.sequentialPipeline;
    }

    return this.parallelPipeline;
  }
}
