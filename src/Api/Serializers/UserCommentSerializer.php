<?php

namespace Justoverclock\ProfileComments\Api\Serializers;


use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\UserSerializer;

class UserCommentSerializer extends AbstractSerializer
{
    protected $type = 'user_comments';

    protected function getDefaultAttributes($model): array
    {
        return [
            'id' => $model->id,
            'comment_title' => $model->comment_title,
            'comment' => $model->comment,
            'commented_by' => $model->commented_by,
            'createdAt' => $this->formatDate($model->created_at),
            'updatedAt' => $this->formatDate($model->updated_at)
        ];
    }

    public function user($comment)
    {
        return $this->hasOne($comment, UserSerializer::class);
    }

    public function commentedBy($comment)
    {
        return $this->hasOne($comment, UserSerializer::class);
    }
}
