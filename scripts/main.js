function getUsername() {
    var href = window.location.href;
    var _username = href.match('github.com/(.[^/]*)');

    var reserved_usernames = ['notifications', 'explore', 'blog', 'new', 'organizations',
        'settings', 'logout', 'stars', 'dashboard', 'repositories',
        'site', 'security', 'contact', 'about', 'trending', 'login'];

    if (_username !== null && _username.length == 2) {
        if (reserved_usernames.indexOf(_username[1]) == -1) {
            return _username[1];
        }
    }

    return null;
}

function injectKeybaseButton() {
    var username = getUsername();

    if (username != null) {
        $.ajax({
            type: 'HEAD',
            url: 'https://keybase.io/' + username,
            success: function() {
                injectKeybaseButtonUser(username);
            },
            error: function() {
                console.log("[KeyBase Add-on] KeyBase user profile could not be found");
            }
        });
    }
}

function injectKeybaseButtonUser(username) {
    $('.tabnav-right')
        .prepend($('.tabnav-right > .user-following-container').clone());

    $('.tabnav-right > span:first-child > span:first-child')
        .remove();

    $('.tabnav-right > span:first-child')
        .removeClass('user-following-container');

    $('.tabnav-right > span:first-child > span')
        .removeAttr('class');

    $('.tabnav-right > span:first-child > span > a')
        .attr('href', 'https://www.keybase.io/' + username)
        .html('<span class="octicon octicon-key"></span>Keybase');
}

chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            injectKeybaseButton();
        }
    }, 10);
});
