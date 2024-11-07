<?php

namespace Justoverclock\ProfileComments\Notification;

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\User\User;
use Justoverclock\ProfileComments\Model\UserCommentsModel;

class NewCommentNotificationBlueprint implements BlueprintInterface
{

    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getFromUser()
    {
        return $this->user;
    }

    public function getSubject()
    {
        return $this->user;
    }

    public function getData(): array
    {
        return [
            'comment' => 'New profile comment notification',
        ];
    }

    public static function getType(): string
    {
        return 'profileComment';
    }

    public static function getSubjectModel(): string
    {
        return User::class;
    }
}
