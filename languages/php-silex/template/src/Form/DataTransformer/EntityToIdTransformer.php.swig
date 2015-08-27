<?php

namespace Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Doctrine\Common\Persistence\ObjectManager;

class EntityToIdTransformer implements DataTransformerInterface
{
    /**
     * @var ObjectManager
     */
    private $om;
    private $entityClass;

    /**
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om, $entityClass)
    {
        $this->om = $om;
        $this->entityClass = $entityClass;
    }

    /**
     * Transforms an object to a string (id).
     *
     * @param  Object|null $entity
     * @return string
     */
    public function transform($entity)
    {
        if (null === $entity) {
            return ""; 
        }

        return $entity->getId();
    }

    /**
     * Transforms a string (id) to an object.
     *
     * @param  string $id
     * @return Object|null
     * @throws TransformationFailedException if object is not found.
     */
    public function reverseTransform($id)
    {
        if (!$id) {
            return null;
        }

        $entity = $this->om->getRepository($this->entityClass)->findOneById($id);

        if (null === $entity) {

            throw new TransformationFailedException(sprintf(
                    'An entity of class ' . $this->entityClass . ' with id "%s" does not exist!', $id
            ));
        }

        return $entity;
    }

}